import { CategoriaService } from './../../categoria/services/categoria.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class ProdutoService{
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService
    ){}

    async findAll(): Promise<Produto[]>{
        return await this.produtoRepository.find({
            relations: {
                categoria: true,
            }
        });

        // SELECT * FROM tb_postagens;
    }

    async findById(id: number): Promise<Produto> {

        let produto = await this.produtoRepository.findOne({
            where:{
                id
            },
            relations: {
                categoria: true,
            }
        });

        // Checar se a produto não foi encontrada
        if (!produto)
            throw new HttpException('Produto não encontrada!', HttpStatus.NOT_FOUND);

        // Retornar a produto, caso ela exista
        return produto;

        // SELECT * FROM tb_postagens WHERE id = ?;
    }

    async findByNome(nome: string): Promise<Produto[]>{
        return await this.produtoRepository.find({
            where:{
                nome: ILike(`%${nome}%`)
            },
            relations: {
                categoria: true,
            }
        })

        // SELECT * FROM tb_postagens WHERE nome LIKE '%nome%';
    }

    async create(produto: Produto): Promise<Produto>{

        // Caso o categoria tenha sido preenchido
        if (produto.categoria){

            let categoria = await this.categoriaService.findById(produto.categoria.id)

            if(!categoria)
                throw new HttpException('Categoria não foi encontrado!', HttpStatus.NOT_FOUND)

            return await this.produtoRepository.save(produto);
        }

        // Caso o categoria não tenha sido preenchido
        return await this.produtoRepository.save(produto);

         // INSERT INTO tb_postagens (nome, texto, data) VALUES (?, ?, server);
    }

    async update(produto: Produto): Promise<Produto>{
        
        let buscaProduto: Produto = await this.findById(produto.id);
        
        // Verifica se a produto existe
        if (!buscaProduto || !produto.id)
            throw new HttpException('Produto não foi encontrada!', HttpStatus.NOT_FOUND)

         // Caso o categoria tenha sido preenchido
        if (produto.categoria){

            let categoria = await this.categoriaService.findById(produto.categoria.id)

            if(!categoria)
                throw new HttpException('Categoria não foi encontrado!', HttpStatus.NOT_FOUND)

            return await this.produtoRepository.save(produto);
        }

        return await this.produtoRepository.save(produto);

         // UPDATE tb_postagens SET nome = ?, texto = ?, data = server WHERE id = ?;

    }

    async delete(id: number): Promise<DeleteResult>{
        
        let buscaProduto: Produto = await this.findById(id);
        
        if (!buscaProduto)
            throw new HttpException('Produto não foi encontrada!', HttpStatus.NOT_FOUND)

        return await this.produtoRepository.delete(id);
        
    }

}